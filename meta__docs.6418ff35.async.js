"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[904],{94648:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},28726:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},16020:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},69472:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},78615:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},19225:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},9806:function(d,a,e){e.r(a),e.d(a,{demos:function(){return I}});var n=e(75271),I={}},55503:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"\u628A\u201C\u8FDB\u95E8\u524D\u7684\u68C0\u67E5\u201D\u4EA4\u7ED9\u62E6\u622A\u5668\uFF0C\u628A\u201C\u8FDB\u95E8\u540E\u7684\u60E9\u7F5A\u201D\u7559\u5728\u4E1A\u52A1\u5C42",paraId:0,tocIndex:2},{value:"\u4EE3\u7801\u903B\u8F91",paraId:1,tocIndex:2},{value:"\u5F52\u5C5E\u5730",paraId:1,tocIndex:2},{value:"\u8FC1\u79FB\u539F\u56E0",paraId:1,tocIndex:2},{value:"IP \u7EF4\u5EA6\u9650\u6D41",paraId:1,tocIndex:2},{value:"\u62E6\u622A\u5668 (Interceptor)",paraId:1,tocIndex:2},{value:"\u8FD9\u662F\u5178\u578B\u7684\u201C\u6D41\u91CF\u5B88\u95E8\u5458\u201D\u5DE5\u4F5C\u3002\u4E0D\u7BA1\u7528\u6237\u540D\u5BF9\u9519\uFF0C\u9AD8\u9891\u8BF7\u6C42\u76F4\u63A5\u5728\u5916\u9762\u6321\u6389\uFF0C\u4FDD\u62A4\u6570\u636E\u5E93\u3002",paraId:1,tocIndex:2},{value:"\u8BBE\u5907\u7EF4\u5EA6\u9650\u6D41",paraId:1,tocIndex:2},{value:"\u62E6\u622A\u5668 (Interceptor)",paraId:1,tocIndex:2},{value:"\u540C\u4E0A\u3002\u5728\u5927\u5382\u4E2D\uFF0CDeviceID \u6821\u9A8C\u662F\u5168\u5C40\u6027\u7684\u5B89\u5168\u5207\u9762\u3002",paraId:1,tocIndex:2},{value:"\u8D26\u53F7\u5931\u8D25\u6B21\u6570\u68C0\u67E5 (\u9636\u68AF\u9501\u5B9A)",paraId:1,tocIndex:2},{value:"AuthServiceImpl (\u4FDD\u7559)",paraId:1,tocIndex:2},{value:"\u5FC5\u987B\u7559\u5728\u8FD9\u91CC",paraId:1,tocIndex:2},{value:"\u3002\u56E0\u4E3A\u62E6\u622A\u5668\u65E0\u6CD5\u63D0\u524D\u77E5\u9053\u7528\u6237\u8F93\u5165\u7684 ",paraId:1,tocIndex:2},{value:"username",paraId:1,tocIndex:2},{value:" \u662F\u5426\u771F\u5B9E\u5B58\u5728\uFF0C\u6216\u8005\u662F\u5426\u9700\u8981\u9488\u5BF9\u7279\u5B9A\u7528\u6237\u6267\u884C\u9501\u5B9A\u3002",paraId:1,tocIndex:2},{value:"\u9A8C\u8BC1\u7801\u6821\u9A8C (\u9636\u68AF A)",paraId:1,tocIndex:2},{value:"AuthServiceImpl (\u4FDD\u7559)",paraId:1,tocIndex:2},{value:"\u9A8C\u8BC1\u7801\u901A\u5E38\u548C\u5177\u4F53\u7684\u767B\u5F55\u64CD\u4F5C\uFF08\u7528\u6237\u540D\u5BC6\u7801\uFF09\u5F3A\u7ED1\u5B9A\u3002",paraId:1,tocIndex:2},{value:"\u5C06IP \u548C DeviceID \u7684\u7269\u7406\u9650\u6D41\u79FB\u51FA\u4E1A\u52A1\u4EE3\u7801\uFF0C\u653E\u5728\u62E6\u622A\u5668\u4E2D,\u5F53\u524D\u8BE5\u6587\u4EF6\u6240\u5728\u76EE\u5F55  ",paraId:2,tocIndex:3},{value:"config/interceptor/",paraId:2,tocIndex:3},{value:`// RiskControlInterceptor.java
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    String ip = request.getRemoteAddr();
    String deviceId = request.getHeader("X-Device-ID");

    // 1. IP \u9650\u6D41\uFF08\u8FC1\u79FB\u81EA AuthServiceImpl\uFF09
    if (!redisUtils.isAllowed("limit:ip:" + ip, 10, 60)) {
        throw new BusinessException(429, "\u64CD\u4F5C\u9891\u7E41\uFF0C\u8BF71\u5206\u949F\u540E\u518D\u8BD5");
    }

    // 2. \u8BBE\u5907\u9650\u6D41\uFF08\u65B0\u589E\u7684\u5927\u5382\u589E\u5F3A\u7EF4\u5EA6\uFF09
    if (StringUtils.isNotBlank(deviceId)) {
        if (!redisUtils.isAllowed("limit:device:" + deviceId, 5, 60)) {
            throw new BusinessException(429, "\u5F53\u524D\u8BBE\u5907\u5C1D\u8BD5\u9891\u7E41");
        }
    }
    return true;
}
`,paraId:3,tocIndex:3},{value:"AuthServiceImpl",paraId:4},{value:"\u73B0\u5728\u7684 ",paraId:5,tocIndex:4},{value:"login",paraId:5,tocIndex:4},{value:" \u65B9\u6CD5\u53D8\u5F97\u975E\u5E38\u5E72\u51C0\uFF0C\u53EA\u5173\u6CE8\u201C\u8D26\u53F7\u5B89\u5168\u201D\u903B\u8F91\u3002",paraId:5,tocIndex:4},{value:`public LoginResponse login(LoginRequest request, HttpServletResponse response) {
    String username = request.getUsername();
    String failKey = "login:fail:user:" + username;

    // 1. \u8D26\u53F7\u9501\u5B9A\u68C0\u67E5 (\u5C5E\u4E8E\u4E1A\u52A1\u98CE\u63A7\uFF0C\u4FDD\u7559)
    checkAccountLockStatus(failKey);

    // 2. \u9A8C\u8BC1\u7801\u6821\u9A8C (\u5C5E\u4E8E\u4E1A\u52A1\u6D41\u7A0B\uFF0C\u4FDD\u7559)
    handleCaptchaIfNecessary(request, failKey);

    try {
        // 3. \u6838\u5FC3\u8BA4\u8BC1\u903B\u8F91
        User dbUser = userService.authenticate(username, request.getPassword());
        
        // \u767B\u5F55\u6210\u529F\u6E05\u7A7A\u8BA1\u6570
        redisTemplate.delete(failKey);
        
        // \u751F\u6210\u4EE4\u724C\u7B49\u540E\u7EED\u64CD\u4F5C...
        return responseData;
        
    } catch (BadCredentialsException e) {
        // 4. \u53EA\u6709\u8BA4\u8BC1\u5931\u8D25\u624D\u589E\u52A0\u8BA1\u6570
        handleLoginFailure(failKey);
        throw new BusinessException(401, "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF");
    }
}
`,paraId:6,tocIndex:4},{value:"\u4FDD\u62A4\u6570\u636E\u5E93\uFF08DB Protection\uFF09",paraId:7,tocIndex:5},{value:"\uFF1A \u5982\u679C IP \u9650\u6D41\u5199\u5728 Service \u91CC\uFF0C\u6076\u610F\u653B\u51FB\u8005\u6BCF\u5206\u949F\u53D1 10000 \u4E2A\u8BF7\u6C42\uFF0CSpring \u4F9D\u7136\u8981\u521B\u5EFA Service \u5B9E\u4F8B\u3001\u89E3\u6790\u53C2\u6570\u3001\u751A\u81F3\u53EF\u80FD\u89E6\u53D1\u6570\u636E\u5E93\u8FDE\u63A5\u3002\u79FB\u5230\u62E6\u622A\u5668\u540E\uFF0C\u8FD9\u4E9B\u65E0\u6548\u6D41\u91CF\u5728\u8FDB\u5165\u6838\u5FC3\u4E1A\u52A1\u5C42\u4E4B\u524D\u5C31\u88AB\u4E22\u5F03\u4E86\u3002",paraId:7,tocIndex:5},{value:"\u89E3\u8026\u4E0E\u590D\u7528",paraId:7,tocIndex:5},{value:"\uFF1A \u4F60\u7684 ",paraId:7,tocIndex:5},{value:"javademo",paraId:7,tocIndex:5},{value:" \u4EE5\u540E\u53EF\u80FD\u6709\u201C\u4FEE\u6539\u652F\u4ED8\u5BC6\u7801\u201D\u3001\u201C\u7ED1\u5B9A\u624B\u673A\u53F7\u201D\u7B49\u63A5\u53E3\u3002\u5982\u679C\u4F60\u628A IP/\u8BBE\u5907\u9650\u6D41\u5199\u5728\u62E6\u622A\u5668\u91CC\uFF0C\u53EA\u9700\u5728 ",paraId:7,tocIndex:5},{value:"WebConfig",paraId:7,tocIndex:5},{value:" \u914D\u7F6E\u4E00\u4E0B\u8DEF\u5F84\uFF0C\u8FD9\u4E9B\u63A5\u53E3\u5C31\u81EA\u52A8\u83B7\u5F97\u4E86\u9632\u5237\u80FD\u529B\uFF0C\u800C\u4E0D\u9700\u8981\u53BB\u6BCF\u4E2A Service \u91CC\u590D\u5236\u7C98\u8D34\u3002",paraId:7,tocIndex:5},{value:"\u7CBE\u786E\u8BA1\u6570",paraId:7,tocIndex:5},{value:"\uFF1A \u73B0\u5728\u7684\u4EE3\u7801\u4E2D\uFF0C\u5982\u679C\u9A8C\u8BC1\u7801\u8F93\u9519\u4E86\uFF0C\u4E5F\u4F1A\u89E6\u53D1 ",paraId:7,tocIndex:5},{value:"catch",paraId:7,tocIndex:5},{value:" \u5BFC\u81F4\u5931\u8D25\u8BA1\u6570\u52A0 1\u3002\u5728\u5927\u5382\u903B\u8F91\u91CC\uFF0C\u8FD9\u53EB\u201C\u8BEF\u6740\u201D\u3002\u901A\u8FC7\u62C6\u5206\uFF0C\u53EA\u6709\u771F\u6B63\u7684",paraId:7,tocIndex:5},{value:"\u5BC6\u7801\u9519\u8BEF",paraId:7,tocIndex:5},{value:"\u624D\u4F1A\u89E6\u53D1\u8D26\u53F7\u9501\u5B9A\u8BA1\u6570\uFF0C\u903B\u8F91\u66F4\u4E25\u5BC6\u3002",paraId:7,tocIndex:5},{value:"\u62E6\u622A\u5668\u4E0D\u53EA\u662F\u201C\u62E6\u622A\u201D\uFF0C\u5B83\u901A\u5E38\u8D1F\u8D23",paraId:8,tocIndex:7},{value:"\u6570\u636E\u91C7\u96C6",paraId:8,tocIndex:7},{value:"\u3002",paraId:8,tocIndex:7},{value:"\u767B\u5F55\u524D",paraId:9,tocIndex:7},{value:"\uFF1A\u62E6\u622A\u5668\u8BB0\u5F55 IP \u548C DeviceID\uFF0C\u5E76\u653E\u5165 ",paraId:9,tocIndex:7},{value:"ThreadLocal",paraId:9,tocIndex:7},{value:"\u3002",paraId:9,tocIndex:7},{value:"\u767B\u5F55\u4E2D",paraId:9,tocIndex:7},{value:"\uFF1A\u4E1A\u52A1\u903B\u8F91\u76F4\u63A5\u4ECE ",paraId:9,tocIndex:7},{value:"ThreadLocal",paraId:9,tocIndex:7},{value:" \u8BFB\uFF0C\u4E0D\u9700\u8981\u518D\u53BB\u89E3\u6790 Request\u3002",paraId:9,tocIndex:7},{value:"\u767B\u5F55\u540E",paraId:9,tocIndex:7},{value:"\uFF1A\u62E6\u622A\u5668\u6839\u636E\u4E1A\u52A1\u7ED3\u679C\uFF08\u6210\u529F/\u5931\u8D25\uFF09\u66F4\u65B0 Redis \u6307\u7EB9\u753B\u50CF\u3002 \u8FD9\u79CD",paraId:9,tocIndex:7},{value:"\u5168\u751F\u547D\u5468\u671F\u7684\u76D1\u63A7",paraId:9,tocIndex:7},{value:"\uFF0C\u5728\u5206\u6563\u7684 Service \u65B9\u6CD5\u91CC\u662F\u5F88\u96BE\u505A\u5230\u7684\u3002",paraId:9,tocIndex:7},{value:"\u5982\u679C\u67D0\u5929\u53D1\u73B0\u4E00\u79CD\u65B0\u578B\u653B\u51FB\u4E13\u95E8\u9488\u5BF9\u201C\u5FD8\u8BB0\u5BC6\u7801\u201D\u63A5\u53E3\uFF0C\u5728\u5927\u5382\u91CC\uFF1A",paraId:10,tocIndex:8},{value:"\u65B9\u5F0F\u4E00\uFF08Service\uFF09",paraId:11,tocIndex:8},{value:"\uFF1A\u9700\u8981\u6539\u4EE3\u7801\u3001\u6D4B\u8BD5\u3001\u8D70\u53D1\u5E03\u6D41\u7A0B\uFF0C\u53EF\u80FD\u9700\u8981\u51E0\u4E2A\u5C0F\u65F6\u3002",paraId:11,tocIndex:8},{value:"\u65B9\u5F0F\u4E8C\uFF08\u7EDF\u4E00\u62E6\u622A\u5668\uFF09",paraId:11,tocIndex:8},{value:"\uFF1A\u8FD0\u7EF4\u6216\u5B89\u5168\u4EBA\u5458\u76F4\u63A5\u5728\u52A8\u6001\u914D\u7F6E\u4E2D\u5FC3\uFF08\u5982 Apollo/Nacos\uFF09\u7ED9\u62E6\u622A\u5668\u52A0\u4E00\u4E2A\u8DEF\u5F84\u8FC7\u6EE4\u89C4\u5219\uFF0C",paraId:11,tocIndex:8},{value:"\u79D2\u7EA7\u751F\u6548",paraId:11,tocIndex:8},{value:"\uFF0C\u77AC\u95F4\u5C01\u6B7B\u653B\u51FB\u8DEF\u5F84\u3002",paraId:11,tocIndex:8},{value:"\u5927\u5382\u4F1A\u5C06\u63A5\u53E3\u5206\u4E3A\u4E0D\u540C\u7B49\u7EA7\uFF1A",paraId:12,tocIndex:9},{value:"L1 (\u516C\u5F00)",paraId:13,tocIndex:9},{value:"\uFF1A\u5982\u9996\u9875\uFF0C\u4E0D\u6821\u9A8C DeviceID\u3002",paraId:13,tocIndex:9},{value:"L2 (\u666E\u901A\u64CD\u4F5C)",paraId:13,tocIndex:9},{value:"\uFF1A\u5982\u770B\u8BC4\u8BBA\uFF0C\u6821\u9A8C DeviceID \u4F46\u4E0D\u9650\u6D41\u3002",paraId:13,tocIndex:9},{value:"L3 (\u9AD8\u5371)",paraId:13,tocIndex:9},{value:"\uFF1A\u5982\u767B\u5F55\u3001\u652F\u4ED8\uFF0C\u5F3A\u5236\u6821\u9A8C DeviceID \u4E14\u6267\u884C\u4E25\u683C\u9650\u6D41\u3002 \u62E6\u622A\u5668\u53EF\u4EE5\u6839\u636E\u6CE8\u89E3\u6216\u8DEF\u5F84\u6A21\u5F0F\uFF08AntPathMatcher\uFF09\u5B8C\u7F8E\u5B9E\u73B0\u8FD9\u79CD",paraId:13,tocIndex:9},{value:"\u7CBE\u7EC6\u5316\u63A7\u5236",paraId:13,tocIndex:9},{value:"\u3002",paraId:13,tocIndex:9},{value:"\u5728\u5927\u5382\u7684\u751F\u4EA7\u73AF\u5883\u91CC\uFF0C\u98CE\u63A7\u62E6\u622A\u5668\u4E0D\u4EC5\u8981\u201C\u62E6\u5F97\u4F4F\u201D\uFF0C\u8FD8\u8981\u201C\u8DD1\u5F97\u5FEB\u201D\u3002\u4E3A\u4E86\u4FDD\u8BC1\u5728\u9AD8\u5E76\u53D1\u767B\u5F55\u8BF7\u6C42\u4E0B\uFF0C\u9650\u6D41\u8BA1\u6570\u4E0D\u4F1A\u56E0\u4E3A\u7F51\u7EDC\u5EF6\u8FDF\u6216\u5E76\u53D1\u5BFC\u81F4\u5931\u6548\uFF0C\u6211\u4EEC\u5FC5\u987B\u4F7F\u7528 ",paraId:14,tocIndex:9},{value:"Redis + Lua \u811A\u672C",paraId:14,tocIndex:9},{value:"\u3002",paraId:14,tocIndex:9},{value:"\u4EE5\u4E0B\u662F\u4E3A\u4F60\u8BBE\u8BA1\u7684 ",paraId:15,tocIndex:9},{value:"RiskControlInterceptor",paraId:15,tocIndex:9},{value:" \u6838\u5FC3\u5B9E\u73B0\u65B9\u6848\u3002",paraId:15,tocIndex:9},{value:"\u4E3A\u4EC0\u4E48\u975E\u8981\u7528 Lua\uFF1F\u56E0\u4E3A ",paraId:16,tocIndex:10},{value:"get",paraId:16,tocIndex:10},{value:"\u3001",paraId:16,tocIndex:10},{value:"incr",paraId:16,tocIndex:10},{value:"\u3001",paraId:16,tocIndex:10},{value:"expire",paraId:16,tocIndex:10},{value:" \u8FD9\u4E09\u6B65\u5982\u679C\u5206\u5F00\u6267\u884C\uFF0C\u5728\u9AD8\u5E76\u53D1\u4E0B\u4F1A\u5BFC\u81F4\u8BA1\u6570\u4E0D\u51C6\uFF08\u7ADE\u6001\u6761\u4EF6\uFF09\u3002Lua \u811A\u672C\u53EF\u4EE5\u50CF\u6570\u636E\u5E93\u4E8B\u52A1\u4E00\u6837\uFF0C\u628A\u8FD9\u51E0\u6B65\u5408\u6210\u4E00\u4E2A\u539F\u5B50\u64CD\u4F5C\u3002",paraId:16,tocIndex:10},{value:"\u4F60\u53EF\u4EE5\u5728\u9879\u76EE\u7684 ",paraId:17,tocIndex:10},{value:"resources",paraId:17,tocIndex:10},{value:" \u76EE\u5F55\u4E0B\u65B0\u5EFA ",paraId:17,tocIndex:10},{value:"lua/limit.lua",paraId:17,tocIndex:10},{value:"\uFF0C\u6216\u8005\u76F4\u63A5\u5728\u4EE3\u7801\u4E2D\u5B9A\u4E49\uFF1A",paraId:17,tocIndex:10},{value:"Lua",paraId:18,tocIndex:10},{value:`-- KEYS[1]: \u5177\u4F53\u7684\u9650\u6D41 Key (\u5982 limit:ip:1.2.3.4)
-- ARGV[1]: \u5141\u8BB8\u7684\u6700\u5927\u5C1D\u8BD5\u6B21\u6570
-- ARGV[2]: \u65F6\u95F4\u7A97\u53E3(\u79D2)

local current = redis.call('get', KEYS[1])
if current and tonumber(current) >= tonumber(ARGV[1]) then
    return 0 -- \u5931\u8D25\uFF1A\u89E6\u53D1\u9650\u6D41
else
    local res = redis.call('incr', KEYS[1])
    if tonumber(res) == 1 then
        redis.call('expire', KEYS[1], ARGV[2])
    end
    return 1 -- \u6210\u529F\uFF1A\u8BA1\u6570\u589E\u52A0\u5E76\u653E\u884C
end
`,paraId:19,tocIndex:10},{value:"\u6211\u4EEC\u5C06 IP \u548C DeviceID \u653E\u5728\u62E6\u622A\u5668\u3002\u6CE8\u610F\uFF1A",paraId:20,tocIndex:11},{value:"User \u7EF4\u5EA6\u7684\u9501\u5B9A\u901A\u5E38\u7559\u5728 Service",paraId:20,tocIndex:11},{value:"\uFF0C\u56E0\u4E3A\u62E6\u622A\u5668\u5728 ",paraId:20,tocIndex:11},{value:"preHandle",paraId:20,tocIndex:11},{value:" \u9636\u6BB5\u5F88\u96BE\u4F18\u96C5\u5730\u5904\u7406\u590D\u6742\u7684\u4E1A\u52A1\u767B\u5F55\u5931\u8D25\u8BA1\u6570\uFF0C\u4F46\u6211\u4EEC\u53EF\u4EE5\u628A\u201C\u7269\u7406\u9650\u6D41\u201D\u653E\u5728\u8FD9\u91CC\u3002",paraId:20,tocIndex:11},{value:`@Component
@RequiredArgsConstructor
public class RiskControlInterceptor implements HandlerInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;
    private final DefaultRedisScript<Long> limitScript; // \u6CE8\u5165\u4E0A\u9762\u5B9A\u4E49\u7684 Lua \u811A\u672C

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 1. \u83B7\u53D6\u7279\u5F81\u7801
        String ip = getClientIp(request);
        String deviceId = request.getHeader("X-Device-ID");
        // \u4E5F\u53EF\u4EE5\u4ECE\u53C2\u6570\u4E2D\u9884\u53D6 username (\u53EF\u9009)
        String username = request.getParameter("username");

        // 2. IP \u7EF4\u5EA6\u68C0\u67E5 (\u6BCF\u5206\u949F 10 \u6B21)
        checkLimit("limit:ip:" + ip, 10, 60, "\u64CD\u4F5C\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");

        // 3. \u8BBE\u5907\u7EF4\u5EA6\u68C0\u67E5 (\u6BCF\u5206\u949F 5 \u6B21 - \u66F4\u4E25\u683C)
        if (StringUtils.isNotBlank(deviceId)) {
            checkLimit("limit:device:" + deviceId, 5, 60, "\u5F53\u524D\u8BBE\u5907\u8BF7\u6C42\u8FC7\u5FEB");
        }
        
        // 4. \u7528\u6237\u7EF4\u5EA6\u7269\u7406\u9650\u6D41 (\u9632\u6B62\u9488\u5BF9\u5355\u4E2A\u8D26\u53F7\u7684\u77AC\u95F4\u8D85\u9AD8\u5E76\u53D1\u7206\u7834)
        if (StringUtils.isNotBlank(username)) {
             checkLimit("limit:user:freq:" + username, 20, 60, "\u8D26\u53F7\u8BF7\u6C42\u8FC7\u591A");
        }

        return true;
    }

    private void checkLimit(String key, int max, int window, String msg) {
        Long result = redisTemplate.execute(limitScript, Collections.singletonList(key), max, window);
        if (result == null || result == 0) {
            throw new BusinessException(429, msg);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        // \u5927\u5382\u89C4\u8303\uFF1A\u8003\u8651\u8D1F\u8F7D\u5747\u8861(Nginx)\u540E\u7684\u771F\u5B9EIP
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
`,paraId:21,tocIndex:11},{value:"\u73B0\u5728\u7684 ",paraId:22,tocIndex:12},{value:"AuthServiceImpl",paraId:22,tocIndex:12},{value:" \u53EA\u9700\u8981\u5904\u7406\u201C\u5BC6\u7801\u9519\u8BEF\u5BFC\u81F4\u7684\u9636\u68AF\u9501\u5B9A\u201D\uFF0C\u8FD9\u5C5E\u4E8E",paraId:22,tocIndex:12},{value:"\u4E1A\u52A1\u98CE\u63A7",paraId:22,tocIndex:12},{value:"\u3002",paraId:22,tocIndex:12},{value:`public LoginResponse login(LoginRequest request) {
    String username = request.getUsername();
    String failKey = "login:fail:user:" + username;

    // 1. \u68C0\u67E5\u662F\u5426\u5904\u4E8E\u9636\u68AF\u9501\u5B9A\u72B6\u6001 (5\u6B21\u5931\u8D25\u540E\u768415\u5206\u949F\u9501\u5B9A)
    Integer failCount = getFailCount(failKey);
    if (failCount >= 5) {
        throw new BusinessException(423, "\u8D26\u53F7\u5DF2\u9501\u5B9A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
    }

    // 2. \u9A8C\u8BC1\u7801\u6821\u9A8C (3\u6B21\u5931\u8D25\u540E\u7684\u5F3A\u5236\u8981\u6C42)
    if (failCount >= 3) {
        validateCaptcha(request); 
    }

    try {
        // 3. \u6570\u636E\u5E93\u903B\u8F91...
        // \u6210\u529F\u5219\u5220\u9664 failKey
    } catch (BadCredentialsException e) {
        // 4. \u53EA\u6709\u8BA4\u8BC1\u5931\u8D25\u624D\u8BB0\u5F55\uFF0C\u903B\u8F91\u66F4\u4E25\u5BC6
        updateFailCount(failKey);
        throw e;
    }
}
`,paraId:23,tocIndex:12},{value:"\u62E6\u622A\u5668 = \u7269\u7406\u5C4F\u969C",paraId:24,tocIndex:13},{value:"\uFF1A\u5B83\u7684\u76EE\u6807\u662F",paraId:24,tocIndex:13},{value:"\u4FDD\u62A4\u670D\u52A1\u5668\u8D44\u6E90",paraId:24,tocIndex:13},{value:"\u3002\u4E0D\u7BA1\u4F60\u8D26\u53F7\u5BF9\u4E0D\u5BF9\uFF0C\u53EA\u8981\u4F60\u53D1\u5F97\u592A\u5FEB\uFF0C\u6211\u5C31\u628A\u4F60\u5F53\u6210\u673A\u5668\u4EBA\u4E71\u68CD\u6253\u6B7B\uFF0C\u4E0D\u8BA9\u4F60\u6D88\u8017 CPU \u548C\u6570\u636E\u5E93\u8FDE\u63A5\u3002",paraId:24,tocIndex:13},{value:"Service = \u4E1A\u52A1\u903B\u8F91",paraId:24,tocIndex:13},{value:"\uFF1A\u5B83\u7684\u76EE\u6807\u662F",paraId:24,tocIndex:13},{value:"\u8D26\u6237\u5B89\u5168",paraId:24,tocIndex:13},{value:"\u3002\u5B83\u5904\u7406\u7684\u662F\u201C\u5BC6\u7801\u8F93\u9519\u201D\u8FD9\u79CD\u6B63\u5E38\u7528\u6237\u4E5F\u53EF\u80FD\u53D1\u751F\u7684\u64CD\u4F5C\uFF0C\u63D0\u4F9B\u7684\u662F\u201C\u9A8C\u8BC1\u7801\u201D\u3001\u201C\u8D26\u53F7\u627E\u56DE\u201D\u7B49\u6709\u6E29\u5EA6\u7684\u4E1A\u52A1\u6D41\u7A0B\u3002",paraId:24,tocIndex:13},{value:"X-Device-ID",paraId:4},{value:"\u5982\u679C\u4F60\u4F7F\u7528 Vue \u6216 React\uFF0C\u53EF\u4EE5\u5199\u4E00\u4E2A\u5168\u5C40\u7684 Axios \u62E6\u622A\u5668\uFF0C\u786E\u4FDD\u6BCF\u4E00\u7B14\u8BF7\u6C42\u90FD\u5E26\u4E0A\u8FD9\u4E2A\u201C\u8EAB\u4EFD\u8BC1\u201D\u3002",paraId:25,tocIndex:14},{value:`// frontend/src/utils/request.js
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const service = axios.create();

service.interceptors.request.use(async config => {
    // \u4F18\u5148\u4ECE\u672C\u5730\u7F13\u5B58\u53D6\uFF0C\u6CA1\u6709\u5219\u751F\u6210
    let deviceId = localStorage.getItem('X-Device-ID');
    if (!deviceId) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
        localStorage.setItem('X-Device-ID', deviceId);
    }
    
    // \u6CE8\u5165\u8BF7\u6C42\u5934
    config.headers['X-Device-ID'] = deviceId;
    return config;
});
`,paraId:26,tocIndex:14},{value:"\u5206\u5C42\u9632\u5FA1",paraId:27,tocIndex:15},{value:`\uFF1A
`,paraId:27,tocIndex:15},{value:"\u62E6\u622A\u5668",paraId:28,tocIndex:15},{value:" \u6321\u4F4F ",paraId:28,tocIndex:15},{value:"\u201C\u6D41\u91CF\u6D2A\u5CF0\u201D",paraId:28,tocIndex:15},{value:"\uFF08\u4E0D\u7BA1\u8D26\u53F7\u5BF9\u4E0D\u5BF9\uFF0C\u5148\u770B\u4F60\u53D1\u5F97\u5FEB\u4E0D\u5FEB\uFF09\u3002",paraId:28,tocIndex:15},{value:"Service \u5C42",paraId:28,tocIndex:15},{value:" \u6321\u4F4F ",paraId:28,tocIndex:15},{value:"\u201C\u66B4\u529B\u7834\u89E3\u201D",paraId:28,tocIndex:15},{value:"\uFF08\u770B\u4F60\u5BC6\u7801\u5BF9\u4E0D\u5BF9\uFF0C\u8F93\u9519\u51E0\u6B21\u9501\u8D26\u53F7\uFF09\u3002",paraId:28,tocIndex:15},{value:"\u5F39\u6027\u6269\u5BB9",paraId:27,tocIndex:15},{value:`\uFF1A
`,paraId:27,tocIndex:15},{value:"\u81EA\u52A8\u8BC6\u522B\u5C40\u57DF\u7F51/NAT \u73AF\u5883\uFF0C\u6709\u6548\u964D\u4F4E\u4E86\u201C\u529E\u516C\u5BA4\u7528\u6237\u201D\u88AB\u96C6\u4F53\u8BEF\u4F24\u7684\u6982\u7387\u3002",paraId:29,tocIndex:15},{value:"\u539F\u5B50\u5B89\u5168\u6027",paraId:27,tocIndex:15},{value:`\uFF1A
`,paraId:27,tocIndex:15},{value:"\u4F7F\u7528 Lua \u811A\u672C\u786E\u4FDD\u4E86\u5728\u9AD8\u5E76\u53D1\u4E0B\uFF0CRedis \u7684 ",paraId:30,tocIndex:15},{value:"get-check-set",paraId:30,tocIndex:15},{value:" \u8FC7\u7A0B\u4E0D\u4F1A\u51FA\u73B0\u5E76\u53D1 bug\u3002",paraId:30,tocIndex:15}]},28998:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[]},45919:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
`,paraId:0,tocIndex:1},{value:"\u8FD9\u4E2A\u4F9D\u8D56\u867D\u7136\u4E0D\u53C2\u4E0E\u7F16\u8BD1\u8FD0\u884C\uFF0C\u4F46\u5B83\u662F\u5927\u5382\u9879\u76EE\u7684\u201C\u6DA6\u6ED1\u5242\u201D\u3002",paraId:1,tocIndex:1},{value:"\u4F5C\u7528\uFF1A\u5B83\u4F1A\u626B\u63CF\u4F60\u7684 @ConfigurationProperties \u6CE8\u89E3\uFF0C\u751F\u6210\u4E00\u4EFD\u5143\u6570\u636E\u6587\u4EF6\u3002",paraId:2,tocIndex:1},{value:"\u597D\u5904\uFF1A\u5F53\u4F60\u4EE5\u540E\u5728 application.yml \u91CC\u8F93\u5165 app.security.risk... \u65F6\uFF0CVS Code \u4F1A\u81EA\u52A8\u5F39\u51FA\u4EE3\u7801\u8865\u5168\uFF0C\u5E76\u663E\u793A\u4F60\u5728\u4EE3\u7801\u91CC\u5199\u7684\u6CE8\u91CA\u3002",paraId:3,tocIndex:1}]},45884:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[]},10762:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:`-- KEYS[1]: IP \u9650\u6D41 Key, KEYS[2]: Device \u9650\u6D41 Key, KEYS[3]: NAT \u96C6\u5408 Key
-- ARGV[1]: IP \u6700\u5927\u6B21\u6570, ARGV[2]: Device \u6700\u5927\u6B21\u6570, ARGV[3]: \u8FC7\u671F\u65F6\u95F4(\u79D2), ARGV[4]: DeviceID

-- 1. \u66F4\u65B0 NAT \u8BBE\u5907\u96C6\u5408\uFF08\u9759\u9ED8\u91C7\u96C6\uFF09
if ARGV[4] ~= "" then
    redis.call('SADD', KEYS[3], ARGV[4])
    redis.call('EXPIRE', KEYS[3], ARGV[3])
end

-- 2. \u68C0\u67E5\u8BBE\u5907\u9650\u6D41 (\u9AD8\u538B\u7EBF)
local dev_curr = redis.call('get', KEYS[2])
if dev_curr and tonumber(dev_curr) >= tonumber(ARGV[2]) then
    return -1 -- \u9519\u8BEF\u7801 -1: \u8BBE\u5907\u88AB\u5C01
end

-- 3. \u68C0\u67E5 IP \u9650\u6D41 (\u57FA\u7840\u7EBF)
local ip_curr = redis.call('get', KEYS[1])
if ip_curr and tonumber(ip_curr) >= tonumber(ARGV[1]) then
    return -2 -- \u9519\u8BEF\u7801 -2: IP \u88AB\u5C01
end

-- 4. \u8BA1\u6570\u589E\u52A0
local res_dev = redis.call('INCR', KEYS[2])
if tonumber(res_dev) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end

local res_ip = redis.call('INCR', KEYS[1])
if tonumber(res_ip) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end

return 1 -- \u6210\u529F\u901A\u8FC7
`,paraId:0,tocIndex:0},{value:"\u8FD9\u6BB5 Lua \u811A\u672C\u662F\u4E00\u4E2A ",paraId:1,tocIndex:0},{value:"Redis \u9650\u6D41\u811A\u672C",paraId:1,tocIndex:0},{value:"\uFF0C\u5B9E\u73B0\u4E86\uFF1A",paraId:1,tocIndex:0},{value:"\u2705 IP \u9650\u6D41",paraId:2,tocIndex:0},{value:"\u2705 \u8BBE\u5907\u9650\u6D41\uFF08\u66F4\u4E25\u683C\uFF09",paraId:2,tocIndex:0},{value:"\u2705 NAT \u8BBE\u5907\u91C7\u96C6\uFF08\u8BB0\u5F55\u4E00\u4E2A IP \u4E0B\u7684\u8BBE\u5907\u96C6\u5408\uFF09",paraId:2,tocIndex:0},{value:"\u2705 \u539F\u5B50\u6267\u884C\uFF08Redis Lua \u4FDD\u8BC1\u6574\u4E2A\u811A\u672C\u4E0D\u53EF\u88AB\u6253\u65AD\uFF09",paraId:2,tocIndex:0},{value:"\u6211\u7ED9\u4F60\u9010\u884C\u8BE6\u7EC6\u89E3\u91CA \u{1F447}",paraId:3,tocIndex:0},{value:`-- KEYS[1]: IP \u9650\u6D41 Key, KEYS[2]: Device \u9650\u6D41 Key, KEYS[3]: NAT \u96C6\u5408 Key
-- ARGV[1]: IP \u6700\u5927\u6B21\u6570, ARGV[2]: Device \u6700\u5927\u6B21\u6570, ARGV[3]: \u8FC7\u671F\u65F6\u95F4(\u79D2), ARGV[4]: DeviceID
`,paraId:4,tocIndex:1},{value:"\u7D22\u5F15",paraId:5,tocIndex:2},{value:"\u542B\u4E49",paraId:5,tocIndex:2},{value:"KEYS[1]",paraId:5,tocIndex:2},{value:"IP \u8BA1\u6570 key",paraId:5,tocIndex:2},{value:"KEYS[2]",paraId:5,tocIndex:2},{value:"\u8BBE\u5907 \u8BA1\u6570 key",paraId:5,tocIndex:2},{value:"KEYS[3]",paraId:5,tocIndex:2},{value:"NAT \u8BBE\u5907\u96C6\u5408 key",paraId:5,tocIndex:2},{value:"\u7D22\u5F15",paraId:6,tocIndex:3},{value:"\u542B\u4E49",paraId:6,tocIndex:3},{value:"ARGV[1]",paraId:6,tocIndex:3},{value:"IP \u6700\u5927\u5141\u8BB8\u6B21\u6570",paraId:6,tocIndex:3},{value:"ARGV[2]",paraId:6,tocIndex:3},{value:"\u8BBE\u5907\u6700\u5927\u5141\u8BB8\u6B21\u6570",paraId:6,tocIndex:3},{value:"ARGV[3]",paraId:6,tocIndex:3},{value:"\u8FC7\u671F\u65F6\u95F4\uFF08\u79D2\uFF09",paraId:6,tocIndex:3},{value:"ARGV[4]",paraId:6,tocIndex:3},{value:"\u5F53\u524D\u8BF7\u6C42\u7684\u8BBE\u5907 ID",paraId:6,tocIndex:3},{value:`if ARGV[4] ~= "" then
    redis.call('SADD', KEYS[3], ARGV[4])
    redis.call('EXPIRE', KEYS[3], ARGV[3])
end
`,paraId:7,tocIndex:4},{value:`if ARGV[4] ~= "" then
`,paraId:8,tocIndex:5},{value:"\u610F\u601D\uFF1A",paraId:9,tocIndex:5},{value:"\u5982\u679C\u4F20\u5165\u4E86 DeviceID\uFF08\u4E0D\u4E3A\u7A7A\u5B57\u7B26\u4E32\uFF09",paraId:10,tocIndex:5},{value:"\u8BF4\u660E\uFF1A",paraId:11,tocIndex:5},{value:"\u6709\u4E9B\u60C5\u51B5\u53EF\u80FD\u53EA\u505A IP \u9650\u6D41\uFF0C\u6CA1\u6709\u8BBE\u5907\u53F7",paraId:12,tocIndex:5},{value:"\u8FD9\u91CC\u505A\u4FDD\u62A4\u5224\u65AD",paraId:12,tocIndex:5},{value:`redis.call('SADD', KEYS[3], ARGV[4])
`,paraId:13,tocIndex:6},{value:"\u6267\u884C Redis \u547D\u4EE4\uFF1A",paraId:14,tocIndex:6},{value:`SADD NAT\u96C6\u5408 \u8BBE\u5907ID
`,paraId:15,tocIndex:6},{value:"\u4F5C\u7528\uFF1A",paraId:16,tocIndex:6},{value:"\u628A\u5F53\u524D\u8BBE\u5907 ID \u52A0\u5165 NAT \u96C6\u5408",paraId:17,tocIndex:6},{value:"\u81EA\u52A8\u53BB\u91CD\uFF08Set \u7ED3\u6784\uFF09",paraId:17,tocIndex:6},{value:"\u7528\u9014\uFF1A",paraId:18,tocIndex:6},{value:"\u7EDF\u8BA1\u4E00\u4E2A IP \u4E0B\u6709\u591A\u5C11\u8BBE\u5907\uFF08\u8BC6\u522B\u5171\u4EAB IP\u3001\u673A\u623F\u4EE3\u7406\u3001NAT \u884C\u4E3A\uFF09",paraId:19,tocIndex:6},{value:`redis.call('EXPIRE', KEYS[3], ARGV[3])
`,paraId:20,tocIndex:7},{value:"\u7ED9 NAT \u96C6\u5408\u8BBE\u7F6E\u8FC7\u671F\u65F6\u95F4\u3002",paraId:21,tocIndex:7},{value:"\u4F5C\u7528\uFF1A",paraId:22,tocIndex:7},{value:"\u9632\u6B62 NAT \u96C6\u5408\u6C38\u4E45\u589E\u957F",paraId:23,tocIndex:7},{value:"\u548C\u9650\u6D41\u7A97\u53E3\u4FDD\u6301\u4E00\u81F4",paraId:23,tocIndex:7},{value:`local dev_curr = redis.call('get', KEYS[2])
`,paraId:24,tocIndex:8},{value:"\u4ECE Redis \u83B7\u53D6\uFF1A",paraId:25,tocIndex:8},{value:`GET deviceKey
`,paraId:26,tocIndex:8},{value:"\u7ED3\u679C\uFF1A",paraId:27,tocIndex:8},{value:"nil \u2192 \u8FD8\u6CA1\u8BA1\u6570",paraId:28,tocIndex:8},{value:"\u6570\u5B57 \u2192 \u5F53\u524D\u8BBE\u5907\u8BBF\u95EE\u6B21\u6570",paraId:28,tocIndex:8},{value:`if dev_curr and tonumber(dev_curr) >= tonumber(ARGV[2]) then
`,paraId:29,tocIndex:8},{value:"\u610F\u601D\uFF1A",paraId:30,tocIndex:8},{value:"\u5982\u679C\u5F53\u524D\u8BBE\u5907\u5DF2\u6709\u8BA1\u6570",paraId:31,tocIndex:8},{value:"\u5E76\u4E14 >= \u6700\u5927\u8BBE\u5907\u6B21\u6570",paraId:31,tocIndex:8},{value:`return -1 -- \u9519\u8BEF\u7801 -1: \u8BBE\u5907\u88AB\u5C01
`,paraId:32,tocIndex:8},{value:"\u76F4\u63A5\u8FD4\u56DE -1",paraId:33,tocIndex:8},{value:"\u542B\u4E49\uFF1A",paraId:34,tocIndex:8},{value:"\u8FD4\u56DE\u503C",paraId:35,tocIndex:8},{value:"\u610F\u4E49",paraId:35,tocIndex:8},{value:"-1",paraId:35,tocIndex:8},{value:"\u8BBE\u5907\u9650\u6D41\u89E6\u53D1",paraId:35,tocIndex:8},{value:"\u26A0\uFE0F \u6CE8\u610F\uFF1A",paraId:36,tocIndex:8},{value:`\u811A\u672C\u7ACB\u5373\u7ED3\u675F
\u4E0D\u4F1A\u518D\u6267\u884C IP \u8BA1\u6570`,paraId:37,tocIndex:8},{value:"\u8FD9\u5C31\u662F\uFF1A",paraId:38,tocIndex:8},{value:"\u8BBE\u5907\u9650\u6D41\u4F18\u5148\u7EA7\u9AD8\u4E8E IP \u9650\u6D41",paraId:39,tocIndex:8},{value:`local ip_curr = redis.call('get', KEYS[1])
`,paraId:40,tocIndex:9},{value:"\u83B7\u53D6 IP \u5F53\u524D\u8BBF\u95EE\u6B21\u6570\u3002",paraId:41,tocIndex:9},{value:`if ip_curr and tonumber(ip_curr) >= tonumber(ARGV[1]) then
`,paraId:42,tocIndex:9},{value:"\u5982\u679C IP \u6B21\u6570 >= IP \u6700\u5927\u6B21\u6570\u3002",paraId:43,tocIndex:9},{value:`return -2 -- \u9519\u8BEF\u7801 -2: IP \u88AB\u5C01
`,paraId:44,tocIndex:9},{value:"\u8FD4\u56DE -2",paraId:45,tocIndex:9},{value:"\u8FD4\u56DE\u503C",paraId:46,tocIndex:9},{value:"\u610F\u4E49",paraId:46,tocIndex:9},{value:"-2",paraId:46,tocIndex:9},{value:"IP \u9650\u6D41\u89E6\u53D1",paraId:46,tocIndex:9},{value:"\u53EA\u6709\u524D\u9762\u90FD\u6CA1\u89E6\u53D1\u5C01\u7981\uFF0C\u624D\u4F1A\u6267\u884C\u8FD9\u91CC\u3002",paraId:47,tocIndex:10},{value:`local res_dev = redis.call('INCR', KEYS[2])
`,paraId:48,tocIndex:11},{value:"\u6267\u884C\uFF1A",paraId:49,tocIndex:11},{value:`INCR deviceKey
`,paraId:50,tocIndex:11},{value:"\u4F5C\u7528\uFF1A",paraId:51,tocIndex:11},{value:"\u8BBE\u5907\u8BBF\u95EE\u6B21\u6570 +1",paraId:52,tocIndex:11},{value:"\u5982\u679C key \u4E0D\u5B58\u5728\uFF0C\u4F1A\u81EA\u52A8\u521B\u5EFA\u5E76\u53D8\u6210 1",paraId:52,tocIndex:11},{value:`if tonumber(res_dev) == 1 then redis.call('EXPIRE', KEYS[2], ARGV[3]) end
`,paraId:53,tocIndex:11},{value:"\u610F\u601D\uFF1A",paraId:54,tocIndex:11},{value:"\u5982\u679C\u8FD9\u662F\u7B2C\u4E00\u6B21\u8BA1\u6570\uFF08\u503C\u7B49\u4E8E 1\uFF09",paraId:55,tocIndex:11},{value:"\u624D\u8BBE\u7F6E\u8FC7\u671F\u65F6\u95F4\u3002",paraId:56,tocIndex:11},{value:"\u76EE\u7684\uFF1A",paraId:57,tocIndex:11},{value:"\u5F62\u6210\u56FA\u5B9A\u65F6\u95F4\u7A97\u53E3",paraId:58,tocIndex:11},{value:"\u907F\u514D\u6BCF\u6B21\u8BF7\u6C42\u90FD\u5237\u65B0\u8FC7\u671F\u65F6\u95F4",paraId:58,tocIndex:11},{value:"\u8FD9\u662F\u4E00\u79CD\uFF1A",paraId:59,tocIndex:11},{value:"\u56FA\u5B9A\u7A97\u53E3\u9650\u6D41\u7B97\u6CD5\uFF08Fixed Window\uFF09",paraId:60,tocIndex:11},{value:`local res_ip = redis.call('INCR', KEYS[1])
`,paraId:61,tocIndex:12},{value:"IP \u6B21\u6570 +1\u3002",paraId:62,tocIndex:12},{value:`if tonumber(res_ip) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end
`,paraId:63,tocIndex:12},{value:"\u540C\u6837\uFF1A",paraId:64,tocIndex:12},{value:"\u7B2C\u4E00\u6B21\u8BBF\u95EE\u624D\u8BBE\u7F6E TTL",paraId:65,tocIndex:12},{value:"\u4FDD\u8BC1\u65F6\u95F4\u7A97\u53E3\u56FA\u5B9A",paraId:65,tocIndex:12},{value:`return 1 -- \u6210\u529F\u901A\u8FC7
`,paraId:66,tocIndex:13},{value:"\u8868\u793A\uFF1A",paraId:67,tocIndex:13},{value:"\u8FD4\u56DE\u503C",paraId:68,tocIndex:13},{value:"\u542B\u4E49",paraId:68,tocIndex:13},{value:"1",paraId:68,tocIndex:13},{value:"\u8BF7\u6C42\u901A\u8FC7",paraId:68,tocIndex:13},{value:`1\uFE0F\u20E3 \u8BB0\u5F55 NAT \u8BBE\u5907
        \u2193
2\uFE0F\u20E3 \u8BBE\u5907\u662F\u5426\u8D85\u9650\uFF1F
        \u2193
      \u662F \u2192 \u8FD4\u56DE -1
        \u2193
3\uFE0F\u20E3 IP \u662F\u5426\u8D85\u9650\uFF1F
        \u2193
      \u662F \u2192 \u8FD4\u56DE -2
        \u2193
4\uFE0F\u20E3 \u8BBE\u5907 +1
5\uFE0F\u20E3 IP +1
        \u2193
\u8FD4\u56DE 1
`,paraId:69,tocIndex:14},{value:"\u8FD4\u56DE\u503C",paraId:70,tocIndex:15},{value:"\u542B\u4E49",paraId:70,tocIndex:15},{value:"1",paraId:70,tocIndex:15},{value:"\u6210\u529F",paraId:70,tocIndex:15},{value:"-1",paraId:70,tocIndex:15},{value:"\u8BBE\u5907\u9650\u6D41",paraId:70,tocIndex:15},{value:"-2",paraId:70,tocIndex:15},{value:"IP \u9650\u6D41",paraId:70,tocIndex:15},{value:`\u2705 \u539F\u5B50\u6267\u884C\uFF08Redis Lua\uFF09
\u2705 \u8BBE\u5907\u4F18\u5148\u7EA7\u9AD8
\u2705 \u652F\u6301 NAT \u91C7\u96C6
\u2705 \u81EA\u52A8\u8FC7\u671F
\u2705 \u65E0\u5E76\u53D1\u95EE\u9898
\u2705 \u8F7B\u91CF\u9AD8\u6027\u80FD`,paraId:71,tocIndex:16},{value:"\u8FD9\u662F\uFF1A",paraId:72,tocIndex:17},{value:"\u56FA\u5B9A\u65F6\u95F4\u7A97\u53E3\u9650\u6D41\uFF08Fixed Window Rate Limiting\uFF09",paraId:73,tocIndex:17},{value:"\u4E0D\u662F\u6ED1\u52A8\u7A97\u53E3\u3002",paraId:74,tocIndex:17},{value:"\u5982\u679C\u4F60\u613F\u610F\uFF0C\u6211\u53EF\u4EE5\u5E2E\u4F60\uFF1A",paraId:75,tocIndex:17},{value:"\u{1F525} \u6539\u9020\u6210\u6ED1\u52A8\u7A97\u53E3\u7248\u672C",paraId:76,tocIndex:17},{value:"\u{1F525} \u6539\u9020\u6210\u6F0F\u6876\u7B97\u6CD5",paraId:76,tocIndex:17},{value:"\u{1F525} \u52A0\u5165 NAT \u8BBE\u5907\u6570\u91CF\u9608\u503C\u63A7\u5236",paraId:76,tocIndex:17},{value:"\u{1F525} \u4F18\u5316\u6210\u751F\u4EA7\u7EA7\u9AD8\u5E76\u53D1\u7248\u672C",paraId:76,tocIndex:17},{value:"\u4F60\u8FD9\u4E2A\u8BBE\u8BA1\u5DF2\u7ECF\u5F88\u4E13\u4E1A\u4E86 \u{1F44D}",paraId:77,tocIndex:17}]},24842:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"This is a guide example.",paraId:0}]},9177:function(d,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[]}}]);
